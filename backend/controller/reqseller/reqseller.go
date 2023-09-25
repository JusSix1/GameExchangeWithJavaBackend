package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/gin-gonic/gin"
)

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
