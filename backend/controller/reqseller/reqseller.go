package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
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

	if tx := entity.DB().Where("user_id = ? and is_confirm = false", userCheckID.ID).Find(&reqseller); tx.RowsAffected != 0 {
		c.JSON(http.StatusOK, gin.H{"data": "true"})
		return
	}

	c.JSON(http.StatusOK, gin.H{})

}
