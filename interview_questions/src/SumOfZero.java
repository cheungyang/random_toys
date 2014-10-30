import java.util.ArrayList;
import java.util.List;

public class SumOfZero {
	public static class ThreeVar {
		private List<Integer> list = new ArrayList<Integer>();
		private int sum = 0;
		private int count = 0;
		
		public ThreeVar(){
		}
		
		public int getSum(){
			return this.sum;
		}
		
		public int getCount(){
			return this.count;
		}
		
		public boolean add(int in) {
			if (this.count == 2 && in != -1 * this.sum) {
				return false;
			} else {
				this.list.add(in);
				this.sum += in;
				this.count++;
				return true;
			}
		}
		
		public String toString(){
			return this.list.toString();
		}
		
		public ThreeVar clone() {
			ThreeVar obj = new ThreeVar();
			for (int i=0; i<this.count; i++){
				obj.add(this.list.get(i));
			}
			return obj;
		}
	}
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		int input[] = new int[] { -1, 2, 10, 3, -10 };
		
		List<ThreeVar> queue = new ArrayList<ThreeVar>();
		for (int i=0, j=input.length; i<j; i++) {
			int num = input[i];
			
			for (int m=0, n=queue.size(); m<n; m++) {
				ThreeVar obj = queue.get(m);
				ThreeVar clone = obj.clone();
				System.out.println(clone.toString());
				if (clone.add(num)) {
					if (clone.getCount() == 3) {
						System.out.println("GET " + clone.toString());
					}
					queue.add(clone);
				}
			}
			ThreeVar oneVar = new ThreeVar();
			oneVar.add(num);
			queue.add(oneVar);
			System.out.println("-------");
		}
		
		// Nothing case handling here
	}

}
