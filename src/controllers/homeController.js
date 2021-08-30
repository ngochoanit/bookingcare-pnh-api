import db from '../models/index'
const getHomePage = async (req, res) => {
    try {
        const data = await db.User.findAll()
        console.log('-----------------------')
        console.log(data)
        console.log('-----------------------')
        return res.render('homePage.ejs', { data: JSON.stringify(data) })
    }
    catch (err) {
        console.error(err)
    }

}
export const homeController = { getHomePage }
