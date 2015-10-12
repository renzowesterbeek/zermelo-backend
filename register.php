<html>
<head>
  <title>Register form notifications</title>
</head>
<body>
  <form action="http://localhost:3000/register" method="post">
    <input type="text" name="email" value="<?php if(isset($_GET['email'])){echo $_GET['email'];} ?>">
    <input type="text" name="appcode" value="<?php if(isset($_GET['appcode'])){echo $_GET['appcode'];} ?>">
    <input type="submit">
  </form>
  <?php
  if(isset($_GET['m'])){
    echo "<p>" . $_GET['m'] . "</p>";
  }
   ?>
</boy>
</html>
