const express = require("express");
const connection = require("./koneksi");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  connection.query("SELECT * FROM siswa", (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("gabisa ambil data siswa");
    } else {
      res.render("siswa", {
        data: rows,
      });
    }
  });
});

app.get("/insert", (req, res) => {
  const { nis, nama, kelas } = req.body;
  res.render("form", {
    data: "",
    nis: nis,
    nama: nama,
    kelas: kelas,
    form: "/simpan",
  });
});

app.post("/simpan", (req, res) => {
  const { nis, nama, kelas } = req.body;

  const data = {
    nis: nis,
    nama: nama,
    kelas: kelas,
  };

  connection.query("INSERT INTO siswa SET ?", data, (err, rows) => {
    if (err) {
      res.render("form", {
        nis: nis,
        nama: nama,
        kelas: kelas,
      });
    } else {
      res.redirect("/");
    }
  });
});

app.get("/edit/:nis", (req, res) => {
  const nis = req.params.nis;
  connection.query(
    `SELECT * FROM siswa WHERE nis = '${nis}'`,
    (err, rows, fields) => {
      if (err) {
        res.render("/");
      } else {
        const nis = rows[0].nis;
        const nama = rows[0].nama;
        const kelas = rows[0].kelas;

        res.render("form", {
          nis: nis,
          nama: nama,
          kelas: kelas,
          form: "/ubah",
        });
      }
    }
  );
});

app.post("/ubah", (req, res) => {
  const { nis, nama, kelas } = req.body;
  const data = {
    nis: nis,
    nama: nama,
    kelas: kelas,
  };
  connection.query(
    `UPDATE siswa SET nama = '${req.body.nama}', kelas = '${req.body.kelas}' WHERE nis = '${req.body.nis}'`,
    data,
    (err, rows, fields) => {
      if (err) {
        res.render("form", {
          nis: nis,
          nama: nama,
          kelas: kelas,
        });
      } else {
        res.redirect("/");
      }
    }
  );
});

app.post("/delete/:nis", (req, res) => {
  const nis = req.params.nis;
  connection.query(
    `DELETE FROM siswa WHERE nis = '${nis}'`,
    (err, rows, fields) => {
      if (err) {
        res.status(500).send("gabisa hapus data siswa");
      } else {
        res.redirect("/");
      }
    }
  );
});

app.listen(6969, () => {
  console.log("server jalan 👍");
});
