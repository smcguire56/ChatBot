package main
import (
    "fmt"
	"net/http"
)

func printString(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}


func main() {
    fmt.Println("hello world")


    http.HandleFunc("/", printString)
	http.ListenAndServe(":8080", nil)
}