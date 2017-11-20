package main
import (
	"net/http"
	"regexp"
	"math/rand"
	"fmt"
)

var arrayOfQuestions[100] string
var wordCount int 
var repeatedCount int
func main() {
	wordCount = 0
	repeatedCount = 0
	http.HandleFunc("/eliza_requests", requestHandler)
	http.Handle("/", http.FileServer(http.Dir("./static")))

	http.ListenAndServe(":8080", nil)
}

func requestHandler(w http.ResponseWriter, r *http.Request) {
	getInput := r.Header.Get("sendInput")
	fmt.Fprintf(w, "%v", getInput)
	fmt.Fprintf(w, "\nBob: %v", ElizaResponse(getInput))
}

func ElizaResponse(text string) string{
	wordCount++
	
	if (checkForRepeate(text, wordCount)) > 2 {
		return "Nothing new to say?"
	}
	response := []string { 
	"I’m not sure what you’re trying to say. Could you explain it to me?",
	"How does that make you feel?",
	"Why do you say that?",
	"What do you mean?",
	"Does that make you happy or sad?",
	"Bob thinks you can think about this",
	"Bob likes the way you think",
	"Bob wants to know more about this"}

	hello := []string { 
	"hi", "hello", "yo", "whats up", "heyo", "heya", "yoyo", "wazaa", "hi there"}

    r_father, _ := regexp.Compile("father")
    r_hi, _ := regexp.Compile("((^|, )(hi|hello|hey))+$")
	r_i_am, _ := regexp.Compile(`(?i)i(?:'|\sa)?m (.*)`)
	r_name, _ := regexp.Compile(`(my)? name is (.*)`)

	if r_father.MatchString(text) {
		return "Why don’t you tell me more about your father?"
	}

	if r_hi.MatchString(text) {
		return hello[rand.Intn(len(response))]
	}
	if r_i_am.MatchString(text)  {
		return r_i_am.ReplaceAllString(text, "How do you know you are $1?")
	}

	if r_name.MatchString(text)  {
		return r_name.ReplaceAllString(text, "Hello $2, how are you?")
	}	

	return response[rand.Intn(len(response))]
}

func checkForRepeate(text string, wordCount int) int{

		arrayOfQuestions[wordCount] = text
	for i := 0; i < wordCount; i++ {
		if text == arrayOfQuestions[i] {
			repeatedCount++
			fmt.Println("repeated")
			return repeatedCount
		}
	}
	return 0
}