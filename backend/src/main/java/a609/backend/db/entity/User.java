package a609.backend.db.entity;


import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.*;


@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
public class User implements UserDetails {
    @Transient
    private final Set<GrantedAuthority> authorities = new HashSet<>();

    public User() {
        authorities.add(new SimpleGrantedAuthority("USER"));
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Id
    @Column(name = "KAKAO_ID")
    Long kakaoId;

    @Column(name="NICKNAME", length = 10)
    String nickname;

    @Column(name="IMAGE_PATH")
    String imagePath;

    @Column(name="DB_IMAGE_PATH")
    String dbImagePath;

    @Column(name="REFRESH_TOKEN")
    String refreshToken;

    @OneToMany(mappedBy="user", cascade = CascadeType.ALL)
    private List<UserTrip> usersTrip = new ArrayList<>();

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


}
