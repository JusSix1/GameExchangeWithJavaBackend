package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
)

// POST /game
func CreateGame(c *gin.Context) {
	var game entity.Game

	if err := c.ShouldBindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// create new object for create new record
	newGame := entity.Game{
		Name: game.Name,
	}

	// validate user
	if _, err := govalidator.ValidateStruct(newGame); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&newGame).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game})

}

// GET /games
func ListGame(c *gin.Context) {
	var games []entity.Game

	if err := entity.DB().Raw("SELECT * FROM games").Scan(&games).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": games})
}

// PATCH /game
func UpdateGame(c *gin.Context) {
	var game entity.Game

	if err := c.ShouldBindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateGame := entity.Game{
		Name: game.Name,
	}

	if _, err := govalidator.ValidateStruct(updateGame); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", game.ID).Updates(&updateGame).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game})
}

// DELETE /game
func DeleteGame(c *gin.Context) {

	var game entity.Game

	if err := c.ShouldBindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Exec("DELETE FROM games WHERE id = ?", game.ID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Game not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": game})
}
