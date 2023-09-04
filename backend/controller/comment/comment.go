package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// // POST /comment/:email
func CreateComment(c *gin.Context) {

	type CommentCreate struct {
		Profile_Name string
		Comment_Text string
		Is_Positive  bool
	}

	var comment CommentCreate
	var commenter entity.User
	var victim entity.User

	email := c.Param("email")

	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("email = ?", email).First(&commenter); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if tx := entity.DB().Where("profile_name = ?", comment.Profile_Name).First(&victim); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	newComment := entity.Comment{
		Commenter_ID: &commenter.ID,
		Victim_ID:    &victim.ID,
		Comment_Text: comment.Comment_Text,
		Is_Positive:  comment.Is_Positive,
	}

	if _, err := govalidator.ValidateStruct(newComment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&newComment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": comment})
}

// GET /comment/:profile_name
func GetComment(c *gin.Context) {
	var victim entity.User
	var commenter entity.User
	var comment []entity.Comment

	profile_name := c.Param("profile_name")

	if tx := entity.DB().Where("profile_name = ?", profile_name).First(&victim); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := entity.DB().Preload("Commenter", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "profile_name", "email", "profile_picture").Find(&commenter)
	}).Raw("SELECT * FROM comments WHERE victim_ID = ? ORDER BY id DESC", victim.ID).Find(&comment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": comment})
}

// GET /mycomment/:email
func GetMyComment(c *gin.Context) {
	var victim entity.User
	var commenter entity.User
	var comment []entity.Comment

	email := c.Param("email")

	if tx := entity.DB().Where("email = ?", email).First(&victim); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := entity.DB().Preload("Commenter", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "profile_name", "email", "profile_picture").Find(&commenter)
	}).Raw("SELECT * FROM comments WHERE victim_ID = ? ORDER BY id DESC", victim.ID).Find(&comment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": comment})
}
