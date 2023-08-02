package main

import (
	account_controller "github.com/JusSix1/GameExchange/controller/account"
	login_controller "github.com/JusSix1/GameExchange/controller/login"
	revenue_controller "github.com/JusSix1/GameExchange/controller/revenue"
	user_controller "github.com/JusSix1/GameExchange/controller/user"
	"github.com/JusSix1/GameExchange/entity"
	"github.com/JusSix1/GameExchange/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	// login User Route
	r.POST("/login/user", login_controller.LoginUser)
	r.POST("/users", user_controller.CreateUser)
	r.GET("/genders", user_controller.ListGenders)

	routerUser := r.Group("/")
	{
		protected := routerUser.Use(middlewares.AuthorizesUser())
		{
			protected.GET("/user/:email", user_controller.GetUser)
			protected.GET("/usersprofilepicture/:email", user_controller.GetUserProfilePicture)
			protected.PATCH("/users", user_controller.UpdateUser)
			protected.PATCH("/usersPassword", user_controller.UpdateUserPassword)
			protected.DELETE("/users/:email", user_controller.DeleteUser)

			protected.POST("/account/:email", account_controller.CreateAccount)
			protected.GET("/all-account/:email", account_controller.GetAllAccount)
			protected.GET("/account-in-order/:id", account_controller.GetAccountInOrder)
			protected.DELETE("/account", account_controller.DeleteAccount)

			protected.GET("/games", account_controller.ListGame)

			// protected.POST("/order/:email", order_controller.CreateOrder)
			// protected.GET("/order/:email", order_controller.GetOrder)
			// protected.PATCH("/order", order_controller.UpdateOrder)

			protected.POST("/revenue/:email", revenue_controller.CreateRevenue)
			protected.GET("/revenue/:email", revenue_controller.GetRevenue)
			protected.PATCH("/revenue", revenue_controller.UpdateRevenue)
		}
	}

	// Run the server
	r.Run()

}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
