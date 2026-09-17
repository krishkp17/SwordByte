import QuizResult from "../models/QuizResult.js";
import  connectDB  from "../utils/db.js";

export async function getProgress(req, res, next) {
  try {
    let results = [];

    if (connectDB()) {
      results = await QuizResult.find({ userId: "demo-user" })
        .sort({ createdAt: 1 })
        .limit(100);
    }

    const scores = results.map((item, index) => ({
      name: `Quiz ${index + 1}`,
      score: item.score,
      date: item.createdAt,
    }));

    const topicMap = {};

    for (const result of results) {
      for (const topic of result.topicPerformance || []) {
        if (!topicMap[topic.topic]) {
          topicMap[topic.topic] = { total: 0, count: 0 };
        }
        topicMap[topic.topic].total += topic.percentage;
        topicMap[topic.topic].count += 1;
      }
    }

    const topics = Object.entries(topicMap).map(([topic, value]) => ({
      topic,
      percentage: Math.round(value.total / value.count),
    }));

    res.json({
      scores:
        scores.length > 0
          ? scores
          : [
              { name: "Mon", score: 48 },
              { name: "Tue", score: 56 },
              { name: "Wed", score: 52 },
              { name: "Thu", score: 68 },
              { name: "Fri", score: 74 },
              { name: "Sat", score: 82 },
              { name: "Sun", score: 86 },
            ],
      topics:
        topics.length > 0
          ? topics
          : [
              { topic: "Ohm's Law", percentage: 100 },
              { topic: "Resistance", percentage: 60 },
              { topic: "Electric Power", percentage: 20 },
              { topic: "Series Circuits", percentage: 40 },
            ],
      streak: 7,
      quizzes: results.length,
      subjects: 4,
    });
  } catch (error) {
    next(error);
  }
}
