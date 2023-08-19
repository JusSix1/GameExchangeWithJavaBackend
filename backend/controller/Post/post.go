package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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
		Is_Reserve:        false,
		Is_Sell:           false,
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

// GET /posts
func ListPost(c *gin.Context) {
	var posts []entity.Post
	var account []entity.Account
	var user []entity.User

	if err := entity.DB().Preload("Account", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "game_id", "user_id", "price").Find(&account)
	}).Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "profile_name", "profile_picture", "email").Find(&user)
	}).Raw("SELECT * FROM posts WHERE is_reserve = 0 ORDER BY created_at DESC").Find(&posts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": posts})
}

// GET /post/:email/:id
func GetPost(c *gin.Context) {
	var post entity.Post
	var account entity.Account
	var user entity.User

	var accountCheck entity.Account
	var userCheck entity.User

	id := c.Param("id")
	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&userCheck); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", id).First(&accountCheck); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Account not found"})
		return
	}

	if userCheck.ID != *accountCheck.User_ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post not found"})
		return
	} else {

		if err := entity.DB().Preload("Account", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "game_id", "user_id", "price").Find(&account)
		}).Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "profile_name", "profile_picture", "email").Find(&user)
		}).Raw("SELECT * FROM posts WHERE id = ? and user_id = ?", id, userCheck.ID).Find(&post).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": post})
}

// PATCH /post
func UpdatePost(c *gin.Context) {
	var post entity.Post

	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// update user fields that are allowed to be updated
	updatePost := entity.Post{
		Description:       post.Description,
		Advertising_image: post.Advertising_image,
	}

	// validate user
	if _, err := govalidator.ValidateStruct(updatePost); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", post.ID).Updates(&updatePost).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": post})
}
