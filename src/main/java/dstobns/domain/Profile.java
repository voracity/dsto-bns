package dstobns.domain;

import com.google.appengine.api.users.User;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class Profile {

  @Id String uniqueId; 
  public String displayName;

  public Profile() {};

  public Profile(User user) {
    this.uniqueId = user.getUserId(); 
    String email = user.getEmail(); 
    this.displayName = (email == null ? null : email.substring(0, email.indexOf("@")));
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }
}
