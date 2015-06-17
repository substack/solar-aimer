// Adafruit Motor shield library
// copyright Adafruit Industries LLC, 2009
// this code is public domain, enjoy!

#include <SoftwareSerial.h>
#include <AFMotor.h>

AF_DCMotor lmotor(1);
AF_DCMotor rmotor(3);

void setup() {
  Serial.begin(9600);           // set up Serial library at 9600 bps
  Serial.println("Motor test!");

  // turn on motor
  lmotor.setSpeed(200);
  lmotor.run(RELEASE);

  rmotor.setSpeed(200);
  rmotor.run(RELEASE);
}

void loop() {
  uint8_t i;
  
  //Serial.print("tick");
  if (Serial.available() > 0) {
    Serial.print((char) (Serial.read()));
  }
  
  /*
  lmotor.run(FORWARD);
  rmotor.run(FORWARD);
  for (i=0; i<255; i++) {
    lmotor.setSpeed(i);  
    rmotor.setSpeed(i);  
    delay(10);
 }
 
  for (i=255; i!=0; i--) {
    lmotor.setSpeed(i);  
    rmotor.setSpeed(i);  
    delay(10);
 }
  
  Serial.print("tock");

  lmotor.run(BACKWARD);
  rmotor.run(BACKWARD);
  for (i=0; i<255; i++) {
    lmotor.setSpeed(i);  
    rmotor.setSpeed(i);  
    delay(10);
 }
 
  for (i=255; i!=0; i--) {
    lmotor.setSpeed(i);  
    rmotor.setSpeed(i);  
    delay(10);
 }
  

  Serial.print("tech");
  lmotor.run(RELEASE);
  rmotor.run(RELEASE);
  delay(1000);
  */
}
