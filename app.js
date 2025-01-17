require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(
    (error) =>
      /*console.log('Something went wrong when retrieving an access token', error)*/ error
  );

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index.hbs");
});

app.get("/artist-search", (req, res, next) => {
  const { artistName } = req.query; // req.query viene del campo de busqueda, req.params del enlace.
  console.log(artistName);
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      //console.log(data.body.artists.items[0])
      res.render("artist-search-results.hbs", {
        artistSearched: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );

  app.get("/albums/:artistId", (req, res, next) => {
    const { artistId } = req.params;

    spotifyApi
      .getArtistAlbums(artistId)
      .then((response) => {
        console.log(response.body.items[0]);
        res.render("albums.hbs", {
          artistAlbum: response.body.items,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.get("/tracks/:albumId", (req, res, next) => {

    const {albumId} = req.params

  spotifyApi
  .getAlbumTracks(albumId)
  .then((response) => {
    console.log(response.body.items)
    res.render("tracks.hbs", {
      albumTracks: response.body.items
    })
  })
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
