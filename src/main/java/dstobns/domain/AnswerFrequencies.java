package dstobns.domain;

import java.util.List;

public class AnswerFrequencies {

  String variableName; 
  List<Integer> frequencies; 

  private AnswerFrequencies() {}

  public AnswerFrequencies(String variableName, List<Integer> frequencies) {
	
	  super();
	  this.variableName = variableName;
	  this.frequencies = frequencies;
  
  }

public String getVariableName() {
	return variableName;
}

public void setVariableName(String variableName) {
	this.variableName = variableName;
}

public List<Integer> getFrequencies() {
	return frequencies;
}

public void setFrequencies(List<Integer> frequencies) {
	this.frequencies = frequencies;
};

  
  
}
