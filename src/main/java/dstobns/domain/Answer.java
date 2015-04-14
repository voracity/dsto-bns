package dstobns.domain;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Answer {

  @Id Long uniqueId; 
  @Index String userId; 
  @Index Long bnvariableCause; 
  @Index Long bnvariableEffect; 
  Boolean value; 

  private Answer() {};

  public Answer(String userId, Long bnvariableCause, Long bnvariableEffect, Boolean value) {
	  this.userId = userId; 
	  this.bnvariableCause = bnvariableCause; 
	  this.bnvariableEffect = bnvariableEffect; 
	  this.value = value; 
  }

public Long getUniqueId() {
	return uniqueId;
}

public void setUniqueId(Long uniqueId) {
	this.uniqueId = uniqueId;
}

public String getUserId() {
	return userId;
}

public void setUserId(String userId) {
	this.userId = userId;
}

public Long getBnvariableCause() {
	return bnvariableCause;
}

public void setBnvariableCause(Long bnvariableCause) {
	this.bnvariableCause = bnvariableCause;
}

public Long getBnvariableEffect() {
	return bnvariableEffect;
}

public void setBnvariableEffect(Long bnvariableEffect) {
	this.bnvariableEffect = bnvariableEffect;
}

public Boolean getValue() {
	return value;
}

public void setValue(Boolean value) {
	this.value = value;
}
  
  
  
}
