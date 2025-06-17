export type PosterInfo = {
	name: string;
	part: string;
	genre: string;
};

// 活動の曜日
export type JobDetails = {
	activityArea: string;
	postingDate: string;
	updateDate: string;
	dayOfWeek: string[];
};

export class JobPosting {
	constructor(
		public readonly id: string,
		public readonly title: string,
		public readonly url: string,
		public readonly description: string,
		public readonly details: JobDetails,
		public readonly soundUrl: string | null,
		public readonly poster: PosterInfo,
	) {}
}

export type SearchCriteria = {
	articleType: string;
	keyword: string;
	areas: string[];
	prefectures: string[];
	parts: string[];
	genres: string[];
};

// 募集情報リポジトリのインターフェース (約束事)
export interface IJobPostingRepository {
	/**
	 * 指定された条件に合う募集情報を探し出す
	 * @param criteria 検索条件
	 * @returns 募集情報の配列
	 */
	find(criteria: SearchCriteria): Promise<JobPosting[]>;
}
