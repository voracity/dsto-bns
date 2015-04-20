package dstobns.domain;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Tier {

  @Id Long uniqueId; 
  String name; 
  Integer level; 

  private Tier() {}
  
  public Tier(String name, Integer level) {
	
	super();
	this.name = name;
	this.level = level;
	
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

public Integer getLevel() {
	return level;
}

public void setLevel(Integer level) {
	this.level = level;
};
  
  
  
}
