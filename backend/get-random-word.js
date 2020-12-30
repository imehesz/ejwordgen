/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!
 * !!! PROD NOTE WARNING !!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * move this file somewhere safe!!!
 */

const fs = require("fs")

const FILE_ALL_WORDS_PATH           = ""
const FILE_ARCHIVED_WORDS_PATH      = ""
const FILE_WORD_OF_THE_DAY_PATH     = ""
const FILE_ERROR_LOG                = ""

const ALL_WORDS = require( FILE_ALL_WORDS_PATH )
const ARCHIVED_WORDS = fs.readFileSync( FILE_ARCHIVED_WORDS_PATH )

const MAX_TRIES = 10
const NO_REPEAT_FOR_DAYS = 30
const SCRIPT_TIMESTAMP = new Date()

var allWordsArr = []
var archivedWordsArr = []
var allArchivedWordsArr = []
var tries = 0
var randWord = ""
var tempWord = ""

var dailyWord = ""
var dailyWordObj = {
    word: "",
    timestamp: SCRIPT_TIMESTAMP
}

const logError = (errorStr) => {
    fs.appendFile(FILE_ERROR_LOG, `${SCRIPT_TIMESTAMP}\t${errorStr}\n`, (err, data) => {
        if(err) {
            console.log("MEGA FAIL!!!")
            return console.log(err)
        }
    })
}

if( ALL_WORDS && ALL_WORDS.values && ALL_WORDS.values.length ) {
    allWordsArr = ALL_WORDS.values.map(el => el[0])
    allArchivedWordsArr = ARCHIVED_WORDS.toString().split("\n")

    if( allArchivedWordsArr && allArchivedWordsArr.length ) {
        // filtering the last X number of words
        archivedWordsArr = allArchivedWordsArr.slice(Math.max(allArchivedWordsArr.length - NO_REPEAT_FOR_DAYS, 0)).map( el => el.split("\t")[0]).filter(el => el != "")

        do {
            tempWord = allWordsArr[Math.floor(Math.random() * allWordsArr.length)]

            if ( archivedWordsArr.indexOf( tempWord ) == -1 ) dailyWord = tempWord

            tries++
        }
        while( dailyWord == "" && tries < MAX_TRIES)

    }

    // this should never happen, but who knows :)
    if ( !dailyWord ) {
        logError("ERR: something went wrong! (or a random word was not found!")
        dailyWord = allWordsArr[Math.floor(Math.random() * allWordsArr.length)]
    }

    // writing sh*t out :)
    dailyWordObj.word = dailyWord
    fs.writeFile(FILE_WORD_OF_THE_DAY_PATH, JSON.stringify(dailyWordObj), (err, data) => {
        if(err) {
            return logError(err)
        }
    })

    fs.appendFile(FILE_ARCHIVED_WORDS_PATH, `${dailyWord}\t${SCRIPT_TIMESTAMP}\n`, (err, data) => {
        if(err) {
            return logError(err)
        }
    })
}
