// initialize variables to be used
console.log("script is running");
var counts = {};
var keys = [];
var allwords = [];
var parastring = [];
var titlestring = [];
var metastring = [];
// initialize array for stopwords to filter
var stopwords = ['i','me','my','myself','we','our','ours','ourselves',
'you','your','yours','yourself','yourselves','he','him','his','himself',
'she','her','hers','herself','it','its','itself','they','them','their',
'theirs','themselves','what','which','who','whom','this','that','these',
'those','am','is','are','was','were','be','been','being','have','has','had',
'having','do','does','did','doing','a','an','the','and','but','if','or',
'because','as','until','while','of','at','by','for','with','about','against',
'between','into','through','during','before','after','above','below','to','from',
'up','down','in','out','on','off','over','under','again','further','then','once',
'here','there','when','where','why','how','all','any','both','each','few','more',
'most','other','some','such','no','nor','not','only','own','same','so','than',
'too','very','s','t','can','will','just','don','should','now', 'span', 'b', 'strong',
'sup', 'href', ''];

// taking the values from title tag, meta tag, and paragraph tag
var paratag = document.getElementsByTagName('p');
var titletag = document.getElementsByTagName('title');
var metatag = document.getElementsByTagName('meta');

// initializing to make the value in string and array
for (var i = 0; i < paratag.length ; i++ ){
  parastring[i] =  paratag[i].innerHTML;
}

for (var i = 0; i < titletag.length ; i++ ){
  titlestring[i] =  titletag[i].innerHTML;
}

for (var i = 0; i < metatag.length ; i++ ){
  metastring[i] =  metatag[i].content;
}

// initialize an array to combine title tag and meta tag to use tfidf
var titleMetaString = [];
var tmtokens = [];
titleMetaString = titlestring.concat(metastring);
allwords = titleMetaString.join(' ');
var tokens = allwords.split(/\W+/);
for (var i = 0; i < tokens.length; i++) {
  if (!/\d+/.test(tokens[i])) {
    tokens[i].toLowerCase();
    if (!stopwords.includes(tokens[i])) {
      tmtokens.push(tokens[i]);
    }
  }
}

// initialize array for paragraph tag
// create array and filter out the stop words
var allpara = [];
var paratoken = [];
allpara = parastring.join('\n');
var tokens2 = allpara.split(/\W+/);
for (var i = 0; i < tokens2.length; i++) {
  if (!/\d+/.test(tokens2[i])) {
    tokens2[i].toLowerCase();
    if (!stopwords.includes(tokens2[i])) {
      paratoken.push(tokens2[i]);
    }
  }
}

var tmresults = [];
var pararesults = [];
tmresults = checkTermFrequency(allwords, tmtokens);
pararesults = checkTermFrequency(allpara, paratoken);

var keywords = [];
keywords = keywords.concat(tmresults,pararesults);
console.log(keywords);

let domain = location.hostname;
console.log(domain);

let keywordDomain = keywords.join(' ')+' :'+domain;

console.log(keywordDomain);

keywordDomain = JSON.stringify(keywordDomain);
let results;

jquery(keywordDomain);



function checkTermFrequency(allwords, tokens){

  // find terms and assign a value to them, adding more frequency when needed
  //var tokens = allwords[1].split(/\W+/);
  for (var i = 0; i < tokens.length; i++) {
    var word = tokens[i];
    if (counts[word] === undefined) {
      counts[word] = {
        tf: 1,
        df: 1
      };
      keys.push(word);
    } else {
      counts[word].tf++;
    }
  }

  for (var i = 0; i < keys.length; i++) {
    var word = keys[i];
    var wordobj = counts[word];
    wordobj.tf = wordobj.tf / keys.length;
  }

  keys.sort(compare);

  function compare(a, b) {
    var countA = counts[a].tf;
    var countB = counts[b].tf;
    return countB - countA;
  }
  var termObj = [];
  for (var i = 0; i < 3; i++) {
    var key = keys[i];
    termObj[i] = key;
  }
  return termObj;

}

function jquery(keydomain){
  $.ajax({
    url: 'http://api.serpstack.com/search',
    data: {
      access_key: 'e703c2c38a2ecc960e15f742f0ad808d',
      query: keydomain
    },
    dataType: 'json',
    success: function(apiResponse) {
      try {
        // if same url as investigating url && if ranking in google's search <= 25
        for (var i = 0; i < apiResponse.organic_results.length; i++) {
          if (apiResponse.organic_results[i].url == location.href && apiResponse.organic_results[i].position <= 25) {
            console.log("This is a safe and legitimate website");
            results++;
          }
        }
        if (results = 0) {
          alert("This website is a Phishing website, do not enter your sensitive data!");
        }
      } catch (e) {
        alert("There has been an error :", e);
      } 
      console.log(apiResponse.organic_results);
    }
  });
}
