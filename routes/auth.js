import express, { application } from "express";
const router = express.Router();
import { check, validationResult } from "express-validator";
import users from "../db.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

router.post(
  "/signup",
  [
    check("email", "Please provide a valid Email").isEmail(),
    check(
      "password",
      "Please provide a password that is greater than 5 characters"
    ).isLength({
      min: 6,
    }),
  ],
  (req, res) => {
    // USER PROVIDES EMAIL & PASSWORD
    const { email, password } = req.body;

    //VALIDATION INPUT EMAIL & PASSWORD
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //VALIDATE IF USER ALREADY EXIT OR NOT
    let user = users.find((user) => {
      return user.email === email;
    });
    if (user) {
      return res.status(400).send("This User already exists");
    }

    //HASHING A PASSWORD
    const hashedPassword = bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        users.push({
          email,
          password: hash,
        });
      });
    });

    const token = JWT.sign(
      {
        email,
      },
      "iucnh793huufb3f",
      {
        expiresIn: 360000,
      }
    );

    res.json({
      token,
    });
  }
);

router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  const user = users.find((user) => {
    return user.email === email;
  });
  if (!user) {
    return res.status(400).send("Invalid Credentials");
  }

  let isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }
  const token = JWT.sign(
    {
      email,
    },
    "iucnh793huufb3f",
    {
      expiresIn: 360000,
    }
  );

  res.json({
    token,
  });
});

router.get("/all", (req, res) => {
  res.json({ users });
});

export default router;
