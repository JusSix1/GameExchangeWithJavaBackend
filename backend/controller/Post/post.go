package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// POST /post
func CreatePost(c *gin.Context) {
	var post entity.Post
	var account entity.Account

	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", post.Account_ID).First(&account); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Account game not found"})
		return
	}

	// create new object for create new record
	newPost := entity.Post{
		Account_ID:        post.Account_ID,
		Description:       post.Description,
		Advertising_image: post.Advertising_image,
		Price:             post.Price,
		Is_Reserve:        post.Is_Reserve,
		Is_Sell:           post.Is_Sell,
	}

	// validate post
	if _, err := govalidator.ValidateStruct(newPost); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&newPost).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateAccount := entity.Account{
		Is_Post: true,
	}

	if err := entity.DB().Where("id = ?", post.Account_ID).Updates(&updateAccount).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": post})

}
