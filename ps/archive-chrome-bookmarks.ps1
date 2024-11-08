$user = "davet"
$today = Get-Date -Format "MMddyyyy"
Copy-Item "C:\Users\$user\AppData\Local\Google\Chrome\User Data\Default\Bookmarks" -Destination "C:\archives\chromebookmarks\Bookmarks$today"