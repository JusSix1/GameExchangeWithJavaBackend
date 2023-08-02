package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/gin-gonic/gin"
)

// GET /games
func ListGame(c *gin.Context) {
	var games []entity.Game

	if err := entity.DB().Raw("SELECT * FROM games ORDER BY name").Scan(&games).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": games})
}
