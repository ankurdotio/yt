import bcrypt from "bcrypt";


export const Login = (req,res)=>{
  try {
    const { username, password } = req.body;
    if (!req.body.username || !req.body.password) {
      throw new Error("Username and password are required");
    }
    // database query username and password check karo DB me
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    bcrypt.verify(user.password, password, (err, result) => {
      if (err) {
        res.sendStatus(500).json({ error: "Error verifying password" });
        throw new Error("Error verifying password");
      }
      if (!result) {
        res.sendStatus(401).json({ error: "Invalid username or password" });
        throw new Error("Invalid username or password");
      }
    });

    res.cookie("token", "token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({      
      success: true,
      message: "Login successful",
      data:{
        username: user.username,
        email: user.email,

      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}