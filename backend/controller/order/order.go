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
		Slip_Create_At:  time.Now(),
		Slip:            order.Slip,
		Is_Slip_Confirm: false,
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
	var user []entity.User
	var account []entity.Account

	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&userCheckID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := entity.DB().Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "profile_name", "email").Find(&user)
	}).Preload("Account", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "game_account").Find(&account)
	}).Raw("SELECT * FROM orders INNER JOIN accounts ON orders.account_id = accounts.id AND accounts.user_id = ? ORDER BY id DESC", userCheckID.ID).Find(&order).Error; err != nil {
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
	}).Raw("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", userCheckID.ID).Find(&order).Error; err != nil {
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
			return db.Select("id", "profile_name", "profile_picture", "email").Find(&userPost)
		}).Raw("SELECT * FROM posts WHERE account_id = ? ORDER BY created_at DESC", o.Account_ID).Find(&orderPosts).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		orderPostJSON = append(orderPostJSON, orderPosts...)
	}

	c.JSON(http.StatusOK, gin.H{"dataReserve": order, "dataPosts": orderPostJSON})
}

// PATCH /orderslip
func UpdateOrderSlip(c *gin.Context) {
	var order entity.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateOrder := entity.Order{
		Slip: order.Slip,
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

// DELETE /account
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

// import (
// 	"net/http"

// 	"github.com/JusSix1/GameExchange/entity"
// 	"github.com/asaskevich/govalidator"
// 	"github.com/gin-gonic/gin"
// )

// // POST /order/:email
// func CreateOrder(c *gin.Context) {
// 	var user entity.User
// 	var order entity.Order
// 	var accoountStatus entity.Account_Status

// 	email := c.Param("email")

// 	type AccountToOrder struct {
// 		Account_ID uint
// 	}

// 	var payload struct {
// 		AccountToOrder []AccountToOrder `json:"accountToOrder"`
// 		DataSlip       struct {
// 			Slip string `json:"Slip"`
// 		} `json:"dataSlip"`
// 	}

// 	if err := c.ShouldBindJSON(&payload); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if tx := entity.DB().Where("email = ?", email).First(&user); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
// 		return
// 	}

// 	// create new object for create new record
// 	newOrder := entity.Order{
// 		User_ID: &user.ID,
// 		Slip:    payload.DataSlip.Slip,
// 	}

// 	if err := entity.DB().Create(&newOrder).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := entity.DB().Raw("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 1", user.ID).Find(&order).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	for i := 0; i < len(payload.AccountToOrder); i++ {

// 		if err := entity.DB().Raw("SELECT * FROM account_statuses WHERE status = 'Sold'").Find(&accoountStatus).Error; err != nil {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 			return
// 		}

// 		// create new object for create new record
// 		updateAccount := entity.Account{
// 			Account_Status_ID: &accoountStatus.ID,
// 			Order_ID:          &order.ID,
// 		}

// 		if err := entity.DB().Where("id = ?", payload.AccountToOrder[i].Account_ID).Updates(&updateAccount).Error; err != nil {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 			return
// 		}

// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": order})
// }

// // GET /order/:email
// func GetOrder(c *gin.Context) {
// 	var user entity.User
// 	var order []entity.Order

// 	email := c.Param("email")

// 	if tx := entity.DB().Where("email = ?", email).First(&user); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
// 		return
// 	}

// 	if err := entity.DB().Raw("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", user.ID).Find(&order).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": order})
// }

// // PATCH /order
// func UpdateOrder(c *gin.Context) {
// 	var order entity.Order

// 	if err := c.ShouldBindJSON(&order); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// update user fields that are allowed to be updated
// 	updateOrder := entity.Order{
// 		Slip: order.Slip,
// 	}

// 	// validate user
// 	if _, err := govalidator.ValidateStruct(updateOrder); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := entity.DB().Where("id = ?", order.ID).Updates(&updateOrder).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": order})
// }

// // GET /all-order-admin
// func GetOrderAdmin(c *gin.Context) {
// 	var order []entity.Order

// 	if err := entity.DB().Raw("SELECT * FROM orders").Find(&order).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": order})
// }
