import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


interface Vote {
    status: 'pending' | 'approved' | 'rejected';
    timestamp: Date | null;
}

// Define the Proposal interface
interface ProposalDocument extends Document {
    name: string;
    department_uid: string;
    description: string;
    dept_uids: string[];
    votingStatus: 'not-started' | 'active' | 'done';
    votes: Map<string, Vote>;
    calculateVotePercentage: () => number;
}

const departmentSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4
    },
    username: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const projectSchema = new mongoose.Schema({
    dept_uid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    wardNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    supervision: {
        type: String,
        required: true
    },
    resources: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started',
        required: true
    }
}, { timestamps: true });

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
}, { timestamps: true });

const workShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Live', 'Completed'],
        default: 'not-started',
        required: true
    },
    link: {
        type: String,
        required: true
    },
    projects: {
        type: [String],
        required: true
    },
    department: {
        type: String,
        required: true
    }
});

const agencySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const proposalSchema = new mongoose.Schema<ProposalDocument>({
    name: { type: String, required: true },
    department_uid: { type: String, required: true },
    description: { type: String, required: true },
    dept_uids: [{ 
        uid: { type: String, required: true }, 
        designation: { type: String, required: true },
        email: { type: String, required: true } 
    }],
    votingStatus: {
        type: String,
        enum: ['not-started', 'active', 'done'],
        default: 'not-started',
        required: true
    },
    votes: {
        type: Map,
        of: {
            status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
            timestamp: { type: Date, default: null }
        },
        required: true
    }
}, { timestamps: true });

// Add the method
proposalSchema.methods.calculateVotePercentage = function (): number {
    const voteStatuses: Vote[] = Array.from(this.votes.values()) as Vote[];
    const totalVotes = voteStatuses.length;
    const approvedVotes = voteStatuses.filter(vote => vote.status === 'approved').length;

    const percentage = (approvedVotes / totalVotes) * 100;
    if (percentage > 50) {
        this.votingStatus = 'done';
    }
    return percentage;
};

// Pre-save hook to automatically calculate vote percentage
proposalSchema.pre<ProposalDocument>('save', function (next) {
    this.calculateVotePercentage();
    next();
});

const tenderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department_uid: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    estimated_cost: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    interested_agencies: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                negotiated_amount: {
                    type: Number,
                    required: true
                }
            }
        ],
        required: true
    },
}, { timestamps: true });

export {
    departmentSchema,
    projectSchema,
    resourceSchema,
    workShopSchema,
    agencySchema,
    proposalSchema,
    tenderSchema
}
