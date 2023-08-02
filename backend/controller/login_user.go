package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/gin-gonic/gin"
)

/* --- ระบบ Login ---*/
// GET /loginuser
func ListUsersLogin(c *gin.Context) {
	var user []entity.User

	if err := entity.DB().Raw("SELECT * FROM users").Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}
