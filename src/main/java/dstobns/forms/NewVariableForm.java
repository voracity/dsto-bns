package dstobns.forms;

public class NewVariableForm {

	private String name; 
	private String label; 
	private String states; 
	
	private NewVariableForm() {} 
	
	/**
     * Public constructor is solely for Unit Test.
     * @param name
     * @param label
     * @param states
     */
	public NewVariableForm(String name, String label, String states) { 
		
		this.name = name; 
		this.label = label; 
		this.states = states;  
		
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

	public String getStates() {
		return states;
	}

	public void setStates(String states) {
		this.states = states;
	}
	
	
}
