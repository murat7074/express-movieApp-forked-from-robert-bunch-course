const express = require("express");
const router = express.Router();

const movieDetails = require("../data/movieDetails");

// /movie/...
function requireJSON(req, res, next) {
  if (!req.is("application/json")) {
    res.json({
      msg: "Content-type must be application/json",
    });
  } else {
    next()
    // postman de http://localhost:3030/movie/2/rating?api_key=123456789  e post yapınca "test" yazısını okuyabiliyoruz
  }
}

router.param("movieId", (req, res, next) => {
  console.log("someone hit a route that used the movieId wilcard!");
  next();
});

router.get("/top_rated", (req, res, next) => {
  let page = req.query.page;
  if (!page) {
    page = 1;
  }
  const results = movieDetails.sort((a, b) => {
    return b.vote_average - a.vote_average;
  });
  let indexToStart = (page - 1) * 20;
  res.json(results.slice(indexToStart, indexToStart + 20));
});


// GET /movie/movieId
router.get("/:movieId", (req, res, next) => {
  const movieId = req.params.movieId;
  const results = movieDetails.find((movie) => {
    return movie.id == movieId; 
  });
  // console.log(results)

  if (!results) {
    res.json({
      msg: "Movie ID is not found",
      production_companies: [],
    });
  } else {
    res.json(results);
  }
});

// POST  /movie/{movie_id}/rating

router.post("/:movieId/rating", requireJSON, (req, res, next) => {
  const movieId = req.params.movieId;
  // console.log(req.get("content-type"))  // burası terminalde "undefined" dönüyor. Eğer postman de "key" tıklarsak aldığımız cevap = application/x-www-form-urlencoded

 // veya // requiredJSON(req, res, next) bu şekilde kullanabiliriz

 const userRating = req.body.value
 if(userRating < 0.5 || userRating > 10) {

  // postman de "post" "raw" yapıp { "value":0.8} gibi rating verebiliriz
  res.json({
    msg:"Rating must be between 0.5 and 10"
  })
 } else {
   res.json({
    msg:"Thank you for submitting your rating",
    status_code:200
  })
 }
 
});

router.delete("/:movieId/rating",requireJSON, (req,res,next)=>{
   // postman de "delete" yapınca msg:"Rating deleted"  mesajını görürüz
res.json({
  msg:"Rating deleted"
})
})

module.exports = router;
