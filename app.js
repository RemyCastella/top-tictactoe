
const createGameBoard = (function() {
    const gameBoard = [null, null, null, null, null, null, null, null, null]

    const loadPage = () => {
        screenController.modal.showModal()
        screenController.modalMessage.textContent = "Enter Your Names!"
        screenController.playButton.textContent = "Start game"
        screenController.playButton.addEventListener("click", handlePlayButton)
    }

    const handlePlayButton = () => {
        if (screenController.playButton.textContent === "Play again!") {
            resetGameBoard()
        } else {
            const playerOneName = screenController.playerOneName.value
            const playerTwoName = screenController.playerTwoName.value
            gameController.setPlayers(createPlayers(playerOneName, playerTwoName))
            screenController.modal.close()
            initialize()
        }
    }

    const initialize = () => {
        gameBoard.forEach((cell, index) => {
            const cellButton = document.createElement("button")
            cellButton.dataset.id = index
            cellButton.classList = "game-board"
            screenController.gameBoardDiv.appendChild(cellButton)
            cellButton.addEventListener("click", buttonEvent)
        })
        screenController.playerOneNameDisplay.textContent = `${screenController.playerOneName.value} X`
        screenController.playerTwoNameDisplay.textContent = `${screenController.playerTwoName.value} O`
    }

    const buttonEvent = (e) => {
        const buttonID = Number(e.target.dataset.id)
        gameController.playerMove(gameController.activePlayer, buttonID)
        createGameBoard.render()
    }

    function createPlayers(playerOne = "Player 1", playerTwo = "Player 2") {

        return [
            {
                name: playerOne,
                token: "X",
                selections: []
            },
            {
                name: playerTwo,
                token: "O",
                selections: [] 
            }
        ]

    }

    const render = () => {
        screenController.getButtons().forEach( (button, index) => {
            button.textContent = gameBoard[index]
        })
    } 

    const resetGameBoard = () => {
        gameBoard.fill(null)
        screenController.getButtons().forEach( button => {
            button.remove()
        })
        const playerOneName = screenController.playerOneName.value
        const playerTwoName = screenController.playerTwoName.value
        gameController.setPlayers(createPlayers(playerOneName, playerTwoName))
        screenController.modal.close()
        initialize()
    }
 
    return { gameBoard, loadPage, render }

})()

const gameController = (function() {

    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    let players = []
    let activePlayer = players[0]

    const setPlayers = (newPlayers) => {
        players = newPlayers;
        activePlayer = players[0];
    };
 
    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    const getActivePlayer = () => activePlayer
    const getPlayerSelections = () => activePlayer.selections
    const getPlayerToken = () => activePlayer.token

    const playerMove = (activePlayer, targetID) => {
        if (createGameBoard.gameBoard[targetID]){
            return
        }
        createGameBoard.gameBoard[targetID] = getPlayerToken()
        getPlayerSelections().push(targetID)
        checkWin(activePlayer)
        createGameBoard.render()
        switchActivePlayer()
    }

    const checkWin = () => {
        const playerSelections = getPlayerSelections()
        win = winningCombinations.some(combination => {
            return combination.every(num => playerSelections.includes(num))
        })

        if (win) {
            highlightWinner(winningCombinations, playerSelections)
            screenController.modal.showModal()
            screenController.modalMessage.textContent = `${activePlayer.name} Wins!`
            screenController.playButton.textContent = "Play again!"
        } else if (!createGameBoard.gameBoard.includes(null)) {
            screenController.modalMessage.textContent = `It's a tie!`
            screenController.playButton.textContent = "Play again!"
            screenController.modal.showModal()
        }
    }

    const highlightWinner = (winningCombinations, playerSelections) => {
        const winningCombination = winningCombinations.find(combination => combination.every(num => playerSelections.includes(num)))
        const buttons = screenController.getButtons()
        const winningButtons = [...buttons].filter((_, index) => winningCombination.includes(index))
        winningButtons.forEach(button => {
            button.classList.toggle("winner")
        })
    }

    return {players, setPlayers, playerMove}
})()

const screenController = (function() {
    const gameBoardDiv = document.querySelector(".gameboard-container")
    const modal = document.querySelector("dialog")
    const modalMessage = document.querySelector("dialog > p:first-child")
    const playButton = document.querySelector("button.play")
    const playerOneName = document.querySelector("#p1-name")
    const playerTwoName = document.querySelector("#p2-name")
    const playerOneNameDisplay = document.querySelector("span.p1-name")
    const playerTwoNameDisplay = document.querySelector("span.p2-name")
    
    const getButtons = () => document.querySelectorAll(".gameboard-container > button")

    return {getButtons, modal, modalMessage, gameBoardDiv, playButton, playerOneName, playerTwoName, playerOneNameDisplay, playerTwoNameDisplay}

})()

createGameBoard.loadPage()