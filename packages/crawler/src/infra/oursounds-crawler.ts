import axios from "axios";
import * as cheerio from "cheerio";
import {
	type SearchCriteria,
	type IJobPostingRepository,
	JobPosting,
	// ... 他の型もインポート
} from "../domain/job-posting.entity.js";

const OURSOUNDS_BASE_URL = "https://oursounds.net";

export class OursoundsCrawler implements IJobPostingRepository {
	async find(criteria: SearchCriteria): Promise<JobPosting[]> {
		console.log("🔍 Finding job postings with criteria:", criteria);

		// 1. 検索条件から検索結果ページのURLを組み立てる (要サイト仕様確認)
		const searchUrl = this.buildSearchUrl(criteria);

		// 2. 検索結果ページから各募集の詳細ページURLリストを取得する
		const detailPageUrls = await this.scrapeDetailPageUrls(searchUrl);

		if (detailPageUrls.length === 0) {
			console.log("No job postings found on the search result page.");
			return [];
		}

		// 3. 各詳細ページをスクレイピングしてJobPostingオブジェクトの配列を作成する
		// Promise.allで並行処理して高速化
		const jobPostings = await Promise.all(
			detailPageUrls.map((url) => this.scrapeDetailPage(url)),
		);

		return jobPostings;
	}

	private buildSearchUrl(criteria: SearchCriteria): string {
		// 例: https://oursounds.net/artist/recruits/search?part_ids[]=6&keyword=...
		// OURSOUNDSのURL仕様に合わせて、検索条件オブジェクトからクエリパラメータを生成します。
		// part_ids[]=6 がドラマーのようです。
		const params = new URLSearchParams();
		params.append("part_ids[]", "6"); // ドラム
		criteria.keywords.forEach((kw) => params.append("keyword[]", kw));
		// ... エリアなどのパラメータも追加
		return `${OURSOUNDS_BASE_URL}/artist/recruits/search?${params.toString()}`;
	}

	private async scrapeDetailPageUrls(searchUrl: string): Promise<string[]> {
		try {
			const { data: html } = await axios.get(searchUrl);
			const $ = cheerio.load(html);
			const urls: string[] = [];

			// ★★★ここに検索結果一覧ページのHTML構造を解析するロジックを実装★★★
			// 例: $('.card .card-title a').each((_, el) => { ... });
			// 適切なCSSセレクタで募集情報へのリンク(<a>タグ)をすべて取得し、
			// そのhref属性からURLを抽出してurls配列に追加します。
			// URLが相対パスの場合は OURSOUNDS_BASE_URL と結合します。

			console.log(`Found ${urls.length} detail page URLs.`);
			return urls;
		} catch (error) {
			console.error("Error scraping detail page URLs:", error);
			return [];
		}
	}

	private async scrapeDetailPage(url: string): Promise<JobPosting> {
		const { data: html } = await axios.get(url);
		const $ = cheerio.load(html);

		// ★★★ここに詳細ページのHTML構造を解析するロジックを実装★★★

		// 求人の内容のテキスト
		const description = $(".card-body > .card-text").text().trim(); // 例

		// 求人の細かい情報
		const details = {
			activityArea: $('th:contains("活動エリア")').next().text().trim(), // 例
			postingDate: $('th:contains("投稿日時")').next().text().trim(), // 例
		};

		// 視聴音源の有無
		const soundUrl = $('iframe[src*="soundcloud.com"]').attr("src") || null; // 例

		// 求人の投稿者の情報
		const poster = {
			name: $(".profile-name").text().trim(), // 例
			profileUrl: $(".profile-link").attr("href") || "", // 例
		};

		// タイトルやID
		const title = $(".card-title").text().trim(); // 例
		const id = url; // URLをIDとして使うのが手軽

		return new JobPosting(
			id,
			title,
			url,
			description,
			details,
			soundUrl,
			poster,
		);
	}
}
