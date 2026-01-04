interface UserStatsProps {
  xp: number;
  level: number;
  title: string;
  streak: number;
  lastActivityDate: Date;
  achievements: string[];
}

export class UserStats {
  private constructor(
    public readonly userId: string,
    private props: UserStatsProps,
  ) {}

  static create(userId: string): UserStats {
    return new UserStats(userId, {
      xp: 0,
      level: 1,
      title: 'Novice',
      streak: 0,
      lastActivityDate: new Date(),
      achievements: [],
    });
  }

  static createFromPersistence(
    data: UserStatsProps & { userId: string },
  ): UserStats {
    return new UserStats(data.userId, {
      xp: data.xp,
      level: data.level,
      title: data.title,
      streak: data.streak,
      lastActivityDate: data.lastActivityDate,
      achievements: data.achievements,
    });
  }

  addXp(amount: number): void {
    this.props.xp += amount;
    this.checkLevelUp();
  }

  private checkLevelUp(): void {
    // Simple leveling formula: Level = floor(sqrt(XP / 100))
    // Or constant scaling: Level * 1000 XP
    // Usage: Level 1 (0-999), Level 2 (1000-1999)

    // Let's use a non-linear curve: XP = Level^2 * 100
    // Level = sqrt(XP / 100)
    const newLevel = Math.floor(Math.sqrt(this.props.xp / 100)) + 1;

    if (newLevel > this.props.level) {
      this.props.level = newLevel;
      // Level up logic - can be handled by handler emitting events
    }
  }

  updateStreak(): void {
    const now = new Date();
    const last = new Date(this.props.lastActivityDate);

    // Normalize to midnight for calendar day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDay = new Date(
      last.getFullYear(),
      last.getMonth(),
      last.getDate(),
    );

    // Check if same day
    if (today.getTime() === lastDay.getTime()) {
      return;
    }

    // Check if consecutive day (difference is exactly 1 day or within safe threshold)
    const diffTime = Math.abs(today.getTime() - lastDay.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      this.props.streak += 1;
    } else {
      this.props.streak = 1;
    }
    this.props.lastActivityDate = now;
  }

  // Getters
  get xp(): number {
    return this.props.xp;
  }

  get level(): number {
    return this.props.level;
  }

  get title(): string {
    return this.props.title;
  }

  get streak(): number {
    return this.props.streak;
  }

  get lastActivityDate(): Date {
    return this.props.lastActivityDate;
  }

  get achievements(): string[] {
    return this.props.achievements;
  }

  // Serialization
  toPersistence() {
    return {
      userId: this.userId,
      xp: this.props.xp,
      level: this.props.level,
      title: this.props.title,
      streak: this.props.streak,
      lastActivityDate: this.props.lastActivityDate,
      achievements: this.props.achievements,
    };
  }
}
