// Adafruit Motor shield library
// copyright Adafruit Industries LLC, 2009
// this code is public domain, enjoy!

#include <SoftwareSerial.h>
#include <AFMotor.h>

AF_DCMotor lmotor(1);
AF_DCMotor rmotor(2);

void setup() {
  Serial.begin(9600);           // set up Serial library at 9600 bps

  // turn on motor
  lmotor.setSpeed(200);
  lmotor.run(RELEASE);

  rmotor.setSpeed(200);
  rmotor.run(RELEASE);
}

void loop() {
  byte cmd = 0;
 
  if (Serial.available() > 0) {
    cmd = Serial.read();
  }
  if (cmd == 'F') {
    rmotor.run(FORWARD);
    lmotor.run(FORWARD);
  }
  else if (cmd == 'B') {
    rmotor.run(BACKWARD);
    lmotor.run(BACKWARD);
  }
  else if (cmd == ' ') {
    rmotor.run(RELEASE);
    lmotor.run(RELEASE);
  }
}
