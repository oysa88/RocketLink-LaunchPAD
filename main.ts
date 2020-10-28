function Rearm () {
    strip.clear()
    strip.show()
    while (pins.digitalReadPin(DigitalPin.P1) == 1) {
        basic.showLeds(`
            . . . . .
            . # # # .
            . # . # .
            . # # # .
            . . . . .
            `)
        basic.showLeds(`
            . . . . .
            . # # # .
            . # # # .
            . # # # .
            . . . . .
            `)
    }
    strip.showColor(neopixel.colors(NeoPixelColors.Purple))
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    basic.pause(100)
    Initialize()
}
radio.onReceivedNumberDeprecated(function (receivedNumber) {
    if (receivedNumber) {
        LinkCheck = true
        lastSeenAlive = input.runningTime()
    }
    if (receivedNumber == 42) {
        if (!(busy)) {
            Launch()
        }
    }
})
function StatusCheck () {
    SelfCheckStatus = 1
    if (LinkCheck) {
        LinkStatus = 1
    } else {
        LinkStatus = 0
    }
    if (IgniterCheck == 1) {
        IgniterStatus = 1
        radio.sendNumber(21)
    } else {
        IgniterStatus = 0
        radio.sendNumber(22)
    }
    if (pins.digitalReadPin(DigitalPin.P1) == 1) {
        ArmStatus = 1
        radio.sendNumber(31)
    } else {
        ArmStatus = 0
        radio.sendNumber(32)
    }
    if ((SelfCheckStatus && LinkStatus && IgniterStatus && ArmStatus) == 1) {
        Ready = 1
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
    } else {
        Ready = 0
        basic.showLeds(`
            # . . . #
            # # . # #
            # . # . #
            # . . . #
            # . . . #
            `)
    }
    SetStrip()
}
function SetStrip () {
    if (SelfCheckStatus == 1) {
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
    }
    if (LinkStatus == 1) {
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Red))
    }
    if (IgniterStatus == 1) {
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Red))
    }
    if (ArmStatus == 1) {
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Red))
    }
    strip.show()
}
function Launch () {
    busy = true
    if (Ready == 1) {
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
        pins.digitalWritePin(DigitalPin.P16, 1)
        basic.pause(500)
        pins.digitalWritePin(DigitalPin.P16, 0)
        Rearm()
    }
    busy = false
}
function Initialize () {
    SelfCheckStatus = 0
    LinkStatus = 0
    IgniterStatus = 0
    IgniterCheck = 0
    ArmStatus = 0
    Ready = 0
    strip.showColor(neopixel.colors(NeoPixelColors.Purple))
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . # # # .
        . # . # .
        . # # # .
        . . . . .
        `)
    basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
        `)
    basic.showLeds(`
        # . . . #
        # # . # #
        # . # . #
        # . . . #
        # . . . #
        `)
    strip.showColor(neopixel.colors(NeoPixelColors.Red))
    basic.pause(200)
}
let Ready = 0
let ArmStatus = 0
let IgniterStatus = 0
let IgniterCheck = 0
let LinkStatus = 0
let SelfCheckStatus = 0
let busy = false
let lastSeenAlive = 0
let LinkCheck = false
let strip: neopixel.Strip = null
radio.setGroup(111)
radio.setTransmitPower(7)
strip = neopixel.create(DigitalPin.P0, 4, NeoPixelMode.RGB)
pins.digitalWritePin(DigitalPin.P15, 1)
let updateFrequency = 200
Initialize()
basic.forever(function () {
    if (!(busy)) {
        StatusCheck()
        if (pins.digitalReadPin(DigitalPin.P5) == 0) {
            strip.showColor(neopixel.colors(NeoPixelColors.Red))
            pins.digitalWritePin(DigitalPin.P14, 1)
            IgniterCheck = pins.digitalReadPin(DigitalPin.P2)
            basic.pause(200)
            pins.digitalWritePin(DigitalPin.P14, 0)
        }
    }
    basic.pause(100)
})
control.inBackground(function () {
    while (true) {
        radio.sendNumber(11)
        if (input.runningTime() - lastSeenAlive > 3 * updateFrequency) {
            LinkCheck = false
        }
        basic.pause(updateFrequency)
    }
})
