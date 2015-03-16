package dstobns;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class BNVariable {

  @Id Long uniqueId; 
  public String name;
  public String label;

  public BNVariable() {};

  public BNVariable(String name, String label) {
	  this.name = name; 
	  this.label = label; 
  }
  
}
