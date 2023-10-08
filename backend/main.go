package main

import (
	account_controller "github.com/JusSix1/GameExchange/controller/account"
	admin_controller "github.com/JusSix1/GameExchange/controller/admin"
	comment_controller "github.com/JusSix1/GameExchange/controller/comment"
	game_controller "github.com/JusSix1/GameExchange/controller/game"
	login_controller "github.com/JusSix1/GameExchange/controller/login"
	order_controller "github.com/JusSix1/GameExchange/controller/order"
	post_controller "github.com/JusSix1/GameExchange/controller/post"
	reqgame_controller "github.com/JusSix1/GameExchange/controller/reqgame"
	reqseller_controller "github.com/JusSix1/GameExchange/controller/reqseller"
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

	// login Admin Route
	r.POST("/login/admin", login_controller.LoginAdmin)

	routerUser := r.Group("/")
	{
		protectedUser := routerUser.Use(middlewares.AuthorizesUser())
		{
			protectedUser.GET("/myinfo/:email", user_controller.GetMyInfo)
			protectedUser.GET("/user/:profilename", user_controller.GetUser)
			protectedUser.GET("/usersprofilepicture/:email", user_controller.GetUserProfilePicture)
			protectedUser.GET("/usernamelist", user_controller.GetUserNameList)
			protectedUser.GET("/usersprofilename/:id", user_controller.GetUserProfileName)
			protectedUser.PATCH("/users", user_controller.UpdateUser)
			protectedUser.PATCH("/usersPassword", user_controller.UpdateUserPassword)
			protectedUser.DELETE("/users/:email", user_controller.DeleteUser)

			protectedUser.POST("/account/:email", account_controller.CreateAccount)
			protectedUser.GET("/all-account/:email", account_controller.GetAllAccount)
			protectedUser.PATCH("/account", account_controller.UpdateAccount)
			protectedUser.DELETE("/account", account_controller.DeleteAccount)

			protectedUser.GET("/games", game_controller.ListGame)

			protectedUser.POST("/reqgame/:email", reqgame_controller.CreateReqGame)

			protectedUser.POST("/post/:email", post_controller.CreatePost)
			protectedUser.GET("/posts", post_controller.ListPost)
			protectedUser.GET("/post/:email/:id", post_controller.GetPost)
			protectedUser.GET("/individualpost/:account_id", post_controller.GetindividualPost)
			protectedUser.PATCH("/post", post_controller.UpdatePost)

			protectedUser.POST("/order/:email", order_controller.CreateOrder)
			protectedUser.GET("/myorder/:email", order_controller.GetOrder)
			protectedUser.GET("/myreserve/:email", order_controller.GetReserve)
			protectedUser.GET("/mybought/:email", order_controller.GetBought)
			protectedUser.PATCH("/orderslip", order_controller.UpdateOrderSlip)
			protectedUser.PATCH("/orderslipconfirm", order_controller.UpdateOrderSlipConfirm)
			protectedUser.PATCH("/orderreive", order_controller.UpdateOrderReceive)
			protectedUser.DELETE("/order", order_controller.DeleteOrder)
			protectedUser.DELETE("/cancelorder", order_controller.CancelOrder)

			protectedUser.POST("/revenue/:email", revenue_controller.CreateRevenue)
			protectedUser.GET("/revenue/:email", revenue_controller.GetRevenue)
			protectedUser.PATCH("/revenue", revenue_controller.UpdateRevenue)

			protectedUser.POST("/comment/:email", comment_controller.CreateComment)
			protectedUser.GET("/comment/:profile_name", comment_controller.GetComment)
			protectedUser.GET("/mycomment/:email", comment_controller.GetMyComment)
			protectedUser.GET("/mycommentedid/:email/:profile_name", comment_controller.GetMyCommentedID)
			protectedUser.DELETE("/deletecomment", comment_controller.DeleteComment)

			protectedUser.POST("/reqseller/:email", reqseller_controller.CreateReqSeller)
			protectedUser.GET("/reqdata/:email", reqseller_controller.GetrReqData)
			protectedUser.GET("/isseller/:email", reqseller_controller.GetIsSeller)
			protectedUser.GET("/isreqseller/:email", reqseller_controller.GetIsReqSeller)
			protectedUser.GET("/isrejectreqseller/:email", reqseller_controller.GetIsRejectReqSeller)
			protectedUser.PATCH("/rerequest/:email", reqseller_controller.UpdateReReqUser)
		}
	}

	routerAdmin := r.Group("/")
	{
		protectedAdmin := routerAdmin.Use(middlewares.AuthorizesAdmin())
		{
			protectedAdmin.POST("/createadmin", admin_controller.CreateAdmin)
			protectedAdmin.GET("/listadmin", admin_controller.GetListAdmin)
			protectedAdmin.PATCH("/adminPassword", admin_controller.UpdateAdminPassword)
			protectedAdmin.DELETE("/admin/:account_name", admin_controller.DeleteAdmin)

			protectedAdmin.GET("/userforadmin/:profilename", user_controller.GetUser)

			protectedAdmin.GET("/reqseller", reqseller_controller.ListReqSeller)
			protectedAdmin.PATCH("/accesspermission/:account_name", reqseller_controller.UpdateAccessUser)
			protectedAdmin.PATCH("/rejectreq/:account_name", reqseller_controller.UpdateRejectUser)

			protectedAdmin.GET("/commentforadmin/:profile_name", comment_controller.GetComment)

			protectedAdmin.POST("/game", game_controller.CreateGame)
			protectedAdmin.GET("/listgame", game_controller.ListGame)
			protectedAdmin.PATCH("/game", game_controller.UpdateGame)
			protectedAdmin.DELETE("/game", game_controller.DeleteGame)

			protectedAdmin.GET("/listreqgames", reqgame_controller.ListReqGame)
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
