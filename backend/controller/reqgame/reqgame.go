package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /reqgame/:email
func CreateReqGame(c *gin.Context) {
	var reqgame entity.ReqGame
	var user entity.User

	email := c.Param("email")

	if err := c.ShouldBindJSON(&reqgame); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("email = ?", email).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// create new object for create new record
	newReqGame := entity.ReqGame{
		User_ID: &user.ID,
		Name:    reqgame.Name,
	}

	// validate user
	if _, err := govalidator.ValidateStruct(newReqGame); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&newReqGame).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reqgame})

}

// GET /listreqgames
func ListReqGame(c *gin.Context) {
	var reqgame []entity.ReqGame
	var user []entity.User

	if err := entity.DB().Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "Profile_Name").Find(&user)
	}).Raw("SELECT * FROM req_games ORDER BY id DESC").Find(&reqgame).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reqgame})
}
