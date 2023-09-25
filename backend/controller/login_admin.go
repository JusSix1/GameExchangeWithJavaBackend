package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/gin-gonic/gin"
)

/* --- ระบบ Login ---*/
// GET /loginadmin
func ListAdminLogin(c *gin.Context) {
	var admin []entity.Admin

	if err := entity.DB().Raw("SELECT * FROM admins").Scan(&admin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": admin})
}
