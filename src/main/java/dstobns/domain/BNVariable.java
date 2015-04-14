package dstobns.domain;

import java.util.Arrays;
import java.util.List;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class BNVariable {

  @Id Long uniqueId; 
  String name; 
  String label; 
  List<String> states; 

  private BNVariable() {};

  public BNVariable(Long uniqueId, String name, String label, String statesStr) {
	  this.uniqueId = uniqueId; 
	  this.name = name; 
	  this.label = label; 
	  this.states = Arrays.asList(statesStr.split(",[ ]*"));
  }
  
public Long getUniqueId() {
	return uniqueId;
}

public void setUniqueId(Long uniqueId) {
	this.uniqueId = uniqueId;
}

public String getName() {
	return name;
}

public void setName(String name) {
	this.name = name;
}

public String getLabel() {
	return label;
}

public void setLabel(String label) {
	this.label = label;
}

public List<String> getStates() {
	return states;
}

public void setStates(List<String> states) {
	this.states = states;
}
  
  
  
}
