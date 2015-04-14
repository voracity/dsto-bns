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
  String comment; 
  Boolean value2; 

  private Answer() {};

  public Answer(String userId, Long bnvariableCause, Long bnvariableEffect) {
	  this.userId = userId; 
	  this.bnvariableCause = bnvariableCause; 
	  this.bnvariableEffect = bnvariableEffect; 
	  this.value = null; 
	  this.value2 = null; 
	  this.comment = ""; 
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

public String getComment() {
	return comment;
}

public void setComment(String comment) {
	this.comment = comment;
}

public Boolean getValue2() {
	return value2;
}

public void setValue2(Boolean value2) {
	this.value2 = value2;
}
  
  
  
}
