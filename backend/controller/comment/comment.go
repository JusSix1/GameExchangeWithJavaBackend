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
		Rating       uint
		Review_image string
	}

	var comment CommentCreate
	var commenter entity.User
	var victim entity.User
	var order entity.Order

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

	if commenter.ID == victim.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot comment for yourself."})
		return
	}

	if tx := entity.DB().Table("orders").
		Select("orders.id").
		Joins("INNER JOIN accounts ON orders.user_id = ? AND accounts.user_id = ? AND accounts.id = orders.account_id", commenter.ID, victim.ID).
		Find(&order); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You have never traded with this user"})
		return
	}

	newComment := entity.Comment{
		Commenter_ID: &commenter.ID,
		Victim_ID:    &victim.ID,
		Comment_Text: comment.Comment_Text,
		Rating:       comment.Rating,
		Review_image: comment.Review_image,
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

// GET /mycommentedid/:email/:profile_name
func GetMyCommentedID(c *gin.Context) {
	var victim entity.User
	var commenter entity.User
	var comment []entity.Comment

	email := c.Param("email")

	profile_name := c.Param("profile_name")

	if tx := entity.DB().Where("email = ?", email).First(&commenter); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if tx := entity.DB().Where("profile_name = ?", profile_name).First(&victim); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := entity.DB().Raw("SELECT ID FROM comments WHERE commenter_ID = ? AND victim_ID = ? ORDER BY id DESC", commenter.ID, victim.ID).Find(&comment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": comment})
}

// DELETE /deletecomment
func DeleteComment(c *gin.Context) {

	var comment entity.Comment

	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Exec("DELETE FROM comments WHERE id = ?", comment.ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": comment})
}
