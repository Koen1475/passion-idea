<?php
require 'php/config.php';
if(isset($_POST["submit"])){
  $username = $_POST["username"];
  $email = $_POST["email"];
  $password = $_POST["password"];
  $confirmpassword = $_POST["confirmpassword"]; // Add this line to retrieve the confirmation password
  $duplicate = mysqli_query($conn, "SELECT * FROM users WHERE username = '$username' OR email = 'email'");
  if(mysqli_num_rows($duplicate) >0) {
    echo
    "<script> alert('Username or Email has already been taken'); </script>";
  }
  else {
    if($password == $confirmpassword){
      $query = "INSERT INTO users VALUES ('', '$username', '$email', '$password')";
      mysqli_query($conn,$query);
      echo 
      "<div class='message'>
                        <p>Registration successful!</p>
                        <a href='auth.php'><button class='btn'>Login Now</button>
                      </div> <br>";
                echo "";
      
    }
    else {
      echo
      "<script> alert('Password does not match');</script>";

    }
  }
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeCraft - Register</title>
    <link rel="stylesheet" href="../auth/style.css" />
    <!-- ICONS LINK -->
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
    />
    <link
      rel="shortcut icon"
      href="/images/Logo-color.png"
      type="image/x-icon"
    />
  </head>
  <body>
    <div class="card-container">
      <div class="box form-box">


        <header>Sign Up</header>
        <form action="" method="post">
                <div class="field input">
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" autocomplete="off" required>
                </div>

                <div class="field input">
                    <label for="email">Email</label>
                    <input type="text" name="email" id="email" autocomplete="off" required>
                </div>

                <div class="field input">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" autocomplete="off" required>
                </div>

                <div class="field input">
                    <label for="confirmpassword">Confirm Password</label>
                    <input type="password" name="confirmpassword" id="confirmpassword" autocomplete="off" required value="">
                </div>

                <div class="field">
                    
                    <input type="submit" class="btn" name="submit" value="Register" required>
                </div>
                <div class="links">
                    Already a member? <a href="../auth/auth.php">Sign In</a>
                </div>
            </form>
      </div>

    </div>
  </body>
</html>
