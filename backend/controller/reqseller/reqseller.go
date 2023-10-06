package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /reqseller/:email
func CreateReqSeller(c *gin.Context) {
	var user entity.User
	var reqSeller entity.ReqSeller
	var reqSellerCheck entity.ReqSeller

	email := c.Param("email")

	if err := c.ShouldBindJSON(&reqSeller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("email = ?", email).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if tx := entity.DB().Where("user_id = ?", user.ID).First(&reqSellerCheck); tx.RowsAffected != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You have already sent a request."})
		return
	}

	// create new object for create new record
	newReqSeller := entity.ReqSeller{
		User_ID:             &user.ID,
		Personal_Card_Front: reqSeller.Personal_Card_Front,
		Personal_Card_Back:  reqSeller.Personal_Card_Back,
		Is_Confirm:          false,
		Is_Reject:           false,
	}

	// validate Account
	if _, err := govalidator.ValidateStruct(newReqSeller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&newReqSeller).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reqSeller})

}

// GET /reqseller
func ListReqSeller(c *gin.Context) {
	var reqseller []entity.ReqSeller
	var admin []entity.Admin
	var user []entity.User

	if err := entity.DB().Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "Profile_Name").Find(&user)
	}).Preload("Admin", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "admin_name").Find(&admin)
	}).Raw("SELECT * FROM req_sellers ORDER BY id DESC").Find(&reqseller).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reqseller})
}

// GET /reqdata/:email
func GetrReqData(c *gin.Context) {
	var userCheckID entity.User
	var reqseller entity.ReqSeller

	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&userCheckID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := entity.DB().Raw("SELECT id,personal_card_front,personal_card_back,note FROM req_sellers WHERE user_id = ?", userCheckID.ID).Find(&reqseller).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reqseller})
}

// GET /isseller/:email
func GetIsSeller(c *gin.Context) {
	var userCheckID entity.User
	var reqseller entity.ReqSeller

	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&userCheckID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := entity.DB().Raw("SELECT is_confirm FROM req_sellers WHERE user_id = ?", userCheckID.ID).Find(&reqseller).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reqseller})
}

// GET /isreqseller/:email
func GetIsReqSeller(c *gin.Context) {
	var userCheckID entity.User
	var reqseller entity.ReqSeller

	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&userCheckID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if tx := entity.DB().Where("user_id = ? and is_confirm = false AND is_reject = false", userCheckID.ID).Find(&reqseller); tx.RowsAffected != 0 {
		c.JSON(http.StatusOK, gin.H{"data": "true"})
		return
	}

	c.JSON(http.StatusOK, gin.H{})

}

// GET /isrejectreqseller/:email
func GetIsRejectReqSeller(c *gin.Context) {
	var userCheckID entity.User
	var reqseller entity.ReqSeller

	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&userCheckID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if tx := entity.DB().Where("user_id = ? and is_confirm = false AND is_reject = true", userCheckID.ID).Find(&reqseller); tx.RowsAffected != 0 {
		c.JSON(http.StatusOK, gin.H{"data": "true"})
		return
	}

	c.JSON(http.StatusOK, gin.H{})

}

// PATCH /accesspermission/:account_name
func UpdateAccessUser(c *gin.Context) {
	var reqSeller entity.ReqSeller
	var admin entity.Admin

	account_name := c.Param("account_name")

	if err := c.ShouldBindJSON(&reqSeller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("account_name = ?", account_name).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Admin not found"})
		return
	}

	updateReqSeller := entity.ReqSeller{
		Admin_ID:   &admin.ID,
		Is_Confirm: true,
		Note:       "",
	}

	if err := entity.DB().Where("id = ?", reqSeller.ID).Updates(&updateReqSeller).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reqSeller})
}

// PATCH /rejectreq/:account_name
func UpdateRejectUser(c *gin.Context) {
	var reqSeller entity.ReqSeller
	var admin entity.Admin

	account_name := c.Param("account_name")

	if err := c.ShouldBindJSON(&reqSeller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("account_name = ?", account_name).First(&admin); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Admin not found"})
		return
	}

	updateReqSeller := map[string]interface{}{
		"Admin_ID":   &admin.ID,
		"Is_Confirm": false,
		"Note":       reqSeller.Note,
		"Is_Reject":  true,
	}

	if err := entity.DB().Model(&reqSeller).Where("id = ?", reqSeller.ID).Updates(updateReqSeller).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reqSeller})
}

// PATCH /rerequest/:email
func UpdateReReqUser(c *gin.Context) {
	var reqSeller entity.ReqSeller
	var user entity.User

	email := c.Param("email")

	if err := c.ShouldBindJSON(&reqSeller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("email = ?", email).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	updateReqSeller := map[string]interface{}{
		"Personal_Card_Front": reqSeller.Personal_Card_Front,
		"Personal_Card_Back":  reqSeller.Personal_Card_Back,
		"Is_Reject":           false,
		"Note":                "",
	}

	if err := entity.DB().Model(&reqSeller).Where("id = ?", reqSeller.ID).Updates(updateReqSeller).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reqSeller})
}
