import express from "express"
import axios from "axios"

const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

const APIkey = "2bae2e631d944e3eab2122155251505"
const geoKey = "ff34daa14ac04c408c24f94898e61e10"

var lat = 17.385044
var lon = 78.486671

app.get("/", async (req, res) => {
    res.render("index1.ejs")
})

app.post("/location", async (req, res) => {
    var pincode = req.body.location
    var coordinate = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${geoKey}`);
    lat = coordinate.data.results[0].geometry.lat;
    lon = coordinate.data.results[0].geometry.lng;
    console.log(lat)
    console.log(lon)
    try {
        var weather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${lat},${lon}&aqi=yes`)
        var data = weather.data
        var airQuality = weather.data.current.air_quality;
        var index= airQuality['us-epa-index'];
        res.render("index2.ejs", { weather: data ,
            index:index
        })
    } catch (error) {
        console.error("Error fetching weather data:", error.message)
        res.send("Error fetching weather data")
    }
})

app.post("/goback", (req, res) => {
    res.redirect("/")
})
app.listen(3000, () => {
    console.log("Starting on http://localhost:3000")
})
