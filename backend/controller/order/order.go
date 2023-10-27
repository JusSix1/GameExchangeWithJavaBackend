package controller

import (
	"net/http"
	"time"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// // POST /order/:email
func CreateOrder(c *gin.Context) {

	type OrderCreate struct {
		User_ID    uint
		Account_ID uint
		Slip       string
		Is_Confirm bool
		Post_ID    uint
	}

	var order OrderCreate
	var user entity.User
	var account entity.Account
	var post entity.Post

	email := c.Param("email")

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", order.Post_ID).First(&post); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", order.Account_ID).First(&account); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Account not found"})
		return
	}

	if post.Is_Reserve {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Account already reserved"})
		return
	}

	if tx := entity.DB().Where("email = ?", email).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if *account.User_ID == user.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot reserve your own account."})
		return
	}

	updatePost := entity.Post{
		Is_Reserve: true,
	}

	if err := entity.DB().Where("id = ?", post.ID).Updates(&updatePost).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newOrder := entity.Order{
		User_ID:         &user.ID,
		Account_ID:      &account.ID,
		Slip:            order.Slip,
		Is_Slip_Confirm: false,
		Is_Reject:       false,
		Is_Receive:      false,
	}

	if _, err := govalidator.ValidateStruct(newOrder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&newOrder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET /myorder/:email
func GetOrder(c *gin.Context) {
	var userCheckID entity.User
	var order []entity.Order

	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&userCheckID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := entity.DB().Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "profile_name", "email")
	}).Preload("Account", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "game_account")
	}).Table("orders").
		Select("orders.id, orders.user_id, orders.account_id, orders.slip, orders.slip_create_at, orders.is_slip_confirm, orders.is_reject, orders.is_receive, orders.note").
		Joins("INNER JOIN accounts ON orders.account_id = accounts.id AND accounts.user_id = ?", userCheckID.ID).
		Order("orders.id, orders.is_slip_confirm").Find(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET /myreserve/:email
func GetReserve(c *gin.Context) {
	var userCheckID entity.User
	var order []entity.Order
	var accountOrder []entity.Account

	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&userCheckID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := entity.DB().Preload("Account", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "game_id", "user_id", "price").Find(&accountOrder)
	}).Raw("SELECT * FROM orders WHERE user_id = ? and is_slip_confirm = false ORDER BY id DESC", userCheckID.ID).Find(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var orderPosts []entity.Post
	var orderPostJSON []entity.Post
	var accountPost []entity.Account
	var userPost []entity.User

	for _, o := range order {
		if err := entity.DB().Preload("Account", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "price").Find(&accountPost)
		}).Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "profile_name", "profile_picture", "email", "bank_account").Find(&userPost)
		}).Raw("SELECT * FROM posts WHERE account_id = ? ORDER BY created_at DESC", o.Account_ID).Find(&orderPosts).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		orderPostJSON = append(orderPostJSON, orderPosts...)
	}

	c.JSON(http.StatusOK, gin.H{"dataReserve": order, "dataPosts": orderPostJSON})
}

// GET /mybought/:email
func GetBought(c *gin.Context) {
	var userCheckID entity.User
	var order []entity.Order
	var accountOrder []entity.Account
	// var user []entity.User

	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&userCheckID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// คำนวณวันที่ 3 วันที่ผ่านมา
	threeDaysAgo := time.Now().Add(-3 * 24 * time.Hour)
	//thirtySecondsAgo := time.Now().Add(-30 * time.Second)

	// ตรวจสอบเงื่อนไขก่อนดึงข้อมูลจากฐานข้อมูล
	err := entity.DB().Where("user_id = ? AND is_slip_confirm = true AND is_receive = false", userCheckID.ID).
		Where("slip_confirm_at <= ?", threeDaysAgo).Find(&order).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดต Is_Receive เป็น true สำหรับรายการที่ผ่านเงื่อนไข
	for _, o := range order {
		o.Is_Receive = true
		entity.DB().Save(&o)
	}

	if err := entity.DB().Preload("Account", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Game").Select("id", "game_id", "game_account", "game_password", "email", "email_password", "user_id").Find(&accountOrder)
	}).Raw("SELECT * FROM orders WHERE user_id = ? and is_slip_confirm = true ORDER BY id DESC", userCheckID.ID).Find(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// PATCH /orderslip
func UpdateOrderSlip(c *gin.Context) {
	var order entity.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateOrder := entity.Order{
		Slip:           order.Slip,
		Slip_Create_At: time.Now(),
	}

	if _, err := govalidator.ValidateStruct(updateOrder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", order.ID).Updates(&updateOrder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// PATCH /orderslipconfirm
func UpdateOrderSlipConfirm(c *gin.Context) {
	var order entity.Order
	var orderCheckID entity.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateOrder := map[string]interface{}{
		"Is_Slip_Confirm": true,
		"Slip_Confirm_At": time.Now(),
		"Is_Reject":       false,
		"Note":            "",
	}

	if err := entity.DB().Model(&order).Where("id = ?", order.ID).Updates(updateOrder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", order.ID).First(&orderCheckID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order not found"})
		return
	}

	updateAccount := entity.Account{
		Is_Sell: true,
	}

	if err := entity.DB().Where("id = ?", orderCheckID.Account_ID).Updates(&updateAccount).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// PATCH /orderreject
func UpdateOrderReject(c *gin.Context) {
	var order entity.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateOrder := entity.Order{
		Note:      order.Note,
		Is_Reject: true,
	}

	if err := entity.DB().Where("id = ?", order.ID).Updates(&updateOrder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// PATCH /orderreive
func UpdateOrderReceive(c *gin.Context) {
	var order entity.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateOrder := entity.Order{
		Is_Receive: true,
	}

	if _, err := govalidator.ValidateStruct(updateOrder); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", order.ID).Updates(&updateOrder).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// DELETE /order
func DeleteOrder(c *gin.Context) {

	type OrderDelete struct {
		Order_ID uint
		Post_ID  uint
	}

	var order OrderDelete

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Exec("UPDATE posts SET is_reserve = false WHERE id = ?", order.Post_ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post not found"})
		return
	}

	if tx := entity.DB().Exec("DELETE FROM orders WHERE id = ?", order.Order_ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// DELETE /cancelorder
func CancelOrder(c *gin.Context) {

	var order entity.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Exec("UPDATE posts SET is_reserve = false WHERE id IN (SELECT posts.id FROM posts INNER JOIN orders ON orders.id = ? and orders.account_id = posts.account_id);", order.ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post not found"})
		return
	}

	if tx := entity.DB().Exec("DELETE FROM orders WHERE id = ?", order.ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET /top5seller
func GetTop5Seller(c *gin.Context) {

	type Top5Seller struct {
		User_ID         uint
		Profile_Name    string
		Profile_Picture string
		Order_Count     uint
	}

	var top5seller []Top5Seller

	if err := entity.DB().Table("users").
		Select("users.id AS user_id, users.profile_name, users.profile_picture, COUNT(orders.id) AS order_count").
		Joins("JOIN accounts ON users.ID = accounts.user_id").
		Joins("JOIN orders ON accounts.id = orders.account_id").
		Where("orders.is_receive = ?", true).
		Where("orders.updated_at >= DATE('now', '-7 days')").
		Group("users.id").
		Order("order_count DESC").
		Limit(5).
		Scan(&top5seller).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": top5seller})
}

// GET /top5game
func GetTop5Game(c *gin.Context) {

	type Top5Game struct {
		Game_ID     uint
		Name        string
		Order_Count uint
	}

	var top5game []Top5Game

	if err := entity.DB().Table("games").
		Select("games.id AS game_id, games.name, COUNT(orders.id) AS order_count").
		Joins("JOIN accounts ON games.id = accounts.game_id").
		Joins("JOIN orders ON accounts.id = orders.account_id").
		Where("orders.is_receive = ?", true).
		Where("orders.updated_at >= DATE('now', '-7 days')").
		Group("games.id").
		Order("order_count DESC").
		Limit(5).
		Scan(&top5game).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": top5game})
}
