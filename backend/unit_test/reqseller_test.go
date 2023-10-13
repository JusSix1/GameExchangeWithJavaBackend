package unit_test

import (
	"testing"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
)

func TestReqSellerValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	reqseller := entity.ReqSeller{ // set up data for test
		Personal_Card_Front: "data:image/jpeg;base64,/9j/4AAQ/AndSoOn",
		Personal_Card_Back:  "data:image/jpeg;base64,/9j/4AAQ/AndSoOn",
	}

	t.Run("the data is correct", func(t *testing.T) {
		uTest := reqseller

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("Personal Card Front can not be blank", func(t *testing.T) {
		uTest := reqseller
		uTest.Personal_Card_Front = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Front image is blank")) // check error message
	})

	t.Run("Personal Card Front invalid format", func(t *testing.T) {
		uTest := reqseller
		uTest.Personal_Card_Front = "asca"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please change front image")) // check error message
	})

	t.Run("Personal Card back can not be blank", func(t *testing.T) {
		uTest := reqseller
		uTest.Personal_Card_Back = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Back image is blank")) // check error message
	})

	t.Run("Personal Card Back invalid format", func(t *testing.T) {
		uTest := reqseller
		uTest.Personal_Card_Back = "asca"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Please change back image")) // check error message
	})
}
