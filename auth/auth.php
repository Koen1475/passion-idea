<?php
require 'php/config.php';
if(isset($_POST["submit"])){
  $username = $_POST["username"];
  $password = $_POST["password"];
  $result = mysqli_query($conn, "SELECT * FROM users WHERE username = '$username'");
  $row = mysqli_fetch_assoc($result);
  if(mysqli_num_rows($result)>0){
    if($password == $row["Password"]){
      $_SESSION["login"] = true;
      $_SESSION["id"] = $row["id"];
      header("Location: ../index.html");
    }
    else {
      echo
    "<script> alert('Wrong Password'); </script>";
    }
  }
  else {
    echo
    "<script> alert('User Not Registered'); </script>";
  }
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeCraft</title>
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
        <header>Login</header>
        <form action="" method="post">
          <div class="field input">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" required />
          </div>
          <div class="field input">
            <label for="username">Password</label>
            <input type="password" name="password" id="password" required />
          </div>
          <div class="field">
            <input
              type="submit"
              class="btn"
              name="submit"
              value="Login"
              required
            />
          </div>
          <div class="links">
            Don't have a account?
            <a href="../auth/register.php"> Sign up now!</a>
          </div>
        </form>
      </div>
    </div>
  </body>
</html>
