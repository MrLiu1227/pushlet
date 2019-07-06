package api;

import java.util.List;

import com.css.apps.base.dict.model.SDict;
import com.css.apps.base.sarea.model.SArea;
import com.css.apps.base.user.model.SUser;

public class Test {

	public static void main(String[] args) {
		SArea user = api.Dao.get(SArea.class, "55");
		System.out.println(user.getName());

		SDict dict = api.Dict.getDict("tiku_styleId", "2");
		System.out.println(dict.getName());

		List<SDict> dicts = (List<SDict>) api.Dict.getDictList("d_para_g", "S_IconColor");
		print(dicts);

		dicts = (List<SDict>) api.Dict.getDictListSel("d_para_g", "S_IconColor");
		print(dicts);

		dicts = (List<SDict>) api.Dict.getDictListQuery("d_para_g", "S_IconColor");
		print(dicts);
	}

	private static void print(List<SDict> dicts) {
		System.out.println("------------------------------");
		for (SDict dt : dicts) {
			System.out.println(dt.getCode() + ": " + dt.getName());
		}
	}
}
