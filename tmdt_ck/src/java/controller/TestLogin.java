import service.LoginService;
import model.User;

public class TestLogin {
    public static void main(String[] args) throws Exception {
        LoginService service = new LoginService();
        User user = service.login("vana@gmail.com", "test123");

        System.out.println(user != null
                ? "Đăng nhập thành công!"
                : "Đăng nhập thất bại!");
    }
}