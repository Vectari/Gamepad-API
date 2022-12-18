let controllerIndex = null;

window.addEventListener('gamepadconnected',(event) => {
    handleConnectDisconnect(event, true);
});

window.addEventListener('gamepaddisconnected',(event) => {
    handleConnectDisconnect(event, false);
});

function handleConnectDisconnect(event, connected) {
    const controllerAreNotConnected = document.getElementById(
        'controller-not-connected-area'
    );
    const controllerAreConnected = document.getElementById(
        'controller-connected-area'
    );

    const gamepad = event.gamepad;
    console.log(gamepad);

    if(connected) {
        controllerIndex = gamepad.index;
        controllerAreNotConnected.style.display = "none";
        controllerAreConnected.style.display = "block";
        createButtonLayout(gamepad.buttons);
        createAxesLayout(gamepad.axes);
    } else {
        controllerIndex = null;
        controllerAreNotConnected.style.display = "block";
        controllerAreConnected.style.display = "none";        
    }
}

function createAxesLayout(axes) {
    const buttonsArea = document.getElementById("buttons");
    for (let i = 0; i < axes.length; i++) {
        buttonsArea.innerHTML +=    `<div id = axis-${i} class = "axis">
                                        <div class = "axis-name">AXIS ${i}</div>
                                        <div class = "axis-value">${axes[i].toFixed(
                                            4
                                        )}</div>
                                    </div> `;
    }
}

function createButtonLayout(buttons) {
    const buttonArea = document.getElementById("buttons");
    buttonArea.innerHTML = "";              // Clear button area in the case user connect gamepad with different button layout
    for(let i = 0; i < buttons.length; i++) {
        buttonArea.innerHTML += createButtonHtml(i, 0);
    }
}

function createButtonHtml(index, value) {
     return `<div class = "button" id = "button-${index}">
                <svg width = "10px" height = "50px">
                    <rect width = "10px" height = "50px" fill = "grey"></rect>
                    <rect
                        class = "button-meter"
                        width = "10px"
                        x = "0"
                        y = "50"
                        data-original-y-position = "50"
                        height = "50px"
                        fill = "rgb(60, 61, 60)"
                    ></rect>
                </svg>
                <div class = "button-text-area">
                    <div class = "button-name">B${index}</div>
                    <div class = "button-value">${value.toFixed(2)}</div>
                </div>
            </div>`;
}

function updateButtonOnGrid(index, value) {
    const buttonArea = document.getElementById(`button-${index}`);
    const buttonValue = buttonArea.querySelector(".button-value");
    buttonValue.innerHTML = value.toFixed(2);

    const buttonMeter = buttonArea.querySelector(".button-meter");
    const meterHeight = Number(buttonMeter.dataset.originalYPosition);
    const meterPosition = meterHeight - (meterHeight/100) * (value * 100);
    buttonMeter.setAttribute("y", meterPosition);
}

function updateControllerButton(index, value) {
    const button = document.getElementById(`controller-b${index}`);
    const selectedButtonClass = "selected-button";

    if (button) {
        if(value > 0) {
            button.classList.add(selectedButtonClass);
            button.style.filter = `contrast(${value * 200}%)`;
        } else {
            button.classList.remove(selectedButtonClass);
            button.style.filter = `contrast(100%)`;
        }
    }
}

function handleButtons(buttons) {
    for (let i = 0; i < buttons.length; i++) {
        const buttonValue = buttons[i].value;
        updateButtonOnGrid(i, buttonValue);
        updateControllerButton(i, buttonValue);
    }
}

function handleSticks(axes) {
    updateAxesGrid(axes);
    updateStick("controller-b10", axes[0], axes[1]);
    updateStick("controller-b11", axes[2], axes[3]);
}

function updateAxesGrid(axes) {
    for (let i = 0; i < axes.length; i++) {
        const axis = document.querySelector(`#axis-${i} .axis-value`);
        const value = axes[i];
        // if (value > 0.06 || value < -0.06) {    // delete comment to set 'dead zone'
            axis.innerHTML = value.toFixed(4);
        // } 
        }
}


function updateStick(elementId, leftRightAxis, upDownAxis) {
    const multiplier = 25;
    const stickLeftRight = leftRightAxis * multiplier;
    const stickUpDown = upDownAxis * multiplier;

    const stick = document.getElementById(elementId);
    const x = Number(stick.dataset.originalXPosition);
    const y = Number(stick.dataset.originalYPosition);

    stick.setAttribute("cx", x + stickLeftRight);
    stick.setAttribute("cy", y + stickUpDown);
}

function handleRumble(gamepad) {
    const rumbleOnButtonPress = document.getElementById("rumble-on-button-press");

    if (rumbleOnButtonPress.checked) {
        if (gamepad.buttons.some(button => button.value > 0)) {
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 25,
                weakMagnitude: 1.0,
                strongMagnitude: 1.0,
            });
        }
    }
}

function handleStickOk(axes) {
    for (let i = 0; i < axes.length; i++) {
        const stickok = document.getElementById("stick-ok");
        const valueaxes0 = axes[0];
        const valueaxes1 = axes[1];
        const valueaxes2 = axes[2];
        const valueaxes3 = axes[3];
        if (valueaxes0 > 0.16 || valueaxes0 < -0.16) {
            stickok.innerHTML = `<div class="stick-not-ok">Stick 0 NOT OK</div>`;
        } else {
            stickok.innerHTML = "<div>Stick OK</div>";
        }
        if (valueaxes1 > 0.16 || valueaxes1 < -0.16) {
            stickok.innerHTML = `<div class="stick-not-ok">Stick 1 NOT OK</div>`;
        }
        if (valueaxes2 > 0.16 || valueaxes2 < -0.16) {
            stickok.innerHTML = `<div class="stick-not-ok">Stick 2 NOT OK</div>`;
        }
        if (valueaxes3 > 0.16 || valueaxes3 < -0.16) {
            stickok.innerHTML = `<div class="stick-not-ok">Stick 3 NOT OK</div>`;
        }
        if ((valueaxes0 > 0.16 || valueaxes0 < -0.16) && (valueaxes1 > 0.16 || valueaxes1 < -0.16)) {
            stickok.innerHTML = `<div class="stick-not-ok">Stick 0 and 1 NOT OK</div>`;
        }
        if ((valueaxes2 > 0.16 || valueaxes2 < -0.16) && (valueaxes3 > 0.16 || valueaxes3 < -0.16)) {
            stickok.innerHTML = `<div class="stick-not-ok">Stick 2 and 3 NOT OK</div>`;
        }
    }
}

function handleStickOkHorizontalLeft(axes) {
    for (let i = 0; i < axes.length; i++) {
        const stickok = document.getElementById("HLX");
        const valueaxes0 = axes[0];
        if (valueaxes0 > 0.16 || valueaxes0 < -0.16) {
            stickok.innerHTML = `<div class="stick-not-ok">NOT OK</div>`;
        } else {
            stickok.innerHTML = `<div id="stick-ok">OK</div>`;
        }
    }
}

function handleStickOkHorizontalRight(axes) {
    for (let i = 0; i < axes.length; i++) {
        const stickok = document.getElementById("HRX");
        const valueaxes0 = axes[2];
        if (valueaxes0 > 0.16 || valueaxes0 < -0.16) {
            stickok.innerHTML = `<div class="stick-not-ok">NOT OK</div>`;
        } else {
            stickok.innerHTML = `<div id="stick-ok">OK</div>`;
        }
    }
}

function handleStickOkVerticalLeft(axes) {
    for (let i = 0; i < axes.length; i++) {
        const stickok = document.getElementById("VLY");
        const valueaxes0 = axes[1];
        if (valueaxes0 > 0.16 || valueaxes0 < -0.16) {
            stickok.innerHTML = `<div class="stick-not-ok">NOT OK</div>`;
        } else {
            stickok.innerHTML = `<div id="stick-ok">OK</div>`;
        }
    }
}

function handleStickOkVerticalRight(axes) {
    for (let i = 0; i < axes.length; i++) {
        const stickok = document.getElementById("VRY");
        const valueaxes0 = axes[3];
        if (valueaxes0 > 0.16 || valueaxes0 < -0.16) {
            stickok.innerHTML = `<div class="stick-not-ok">NOT OK</div>`;
        } else {
            stickok.innerHTML = `<div id="stick-ok">OK</div>`;
        }
    }
}

function gameLoop() {
if (controllerIndex !== null) {
    const gamepad = navigator.getGamepads()[controllerIndex];
    handleButtons(gamepad.buttons);
    handleSticks(gamepad.axes);
    handleRumble(gamepad);
    handleStickOk(gamepad.axes);
    handleStickOkHorizontalLeft(gamepad.axes);
    handleStickOkHorizontalRight(gamepad.axes);
    handleStickOkVerticalLeft(gamepad.axes);
    handleStickOkVerticalRight(gamepad.axes);
}
    requestAnimationFrame(gameLoop);
}

gameLoop();